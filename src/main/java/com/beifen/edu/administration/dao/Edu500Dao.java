package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu500;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public interface Edu500Dao extends JpaRepository<Edu500, Long>, JpaSpecificationExecutor<Edu500> {
    //查看教学点是否被占用
    @Query(value = "select * from edu500 e where e.edu500_id = ?1 and e.cdzt_code = '1'", nativeQuery = true)
    List<Edu500> checkIsUsed(String edu500Id);

    // 根据id删除教室
    @Transactional
    @Modifying
    @Query(value = "delete from edu500 where Edu500_ID =?1", nativeQuery = true)
    void removeSite(String edu500id);

    //根据教学点ID集合查询教学点
    @Query(value = "select new com.beifen.edu.administration.domian.Edu500(e.edu500Id,e.city,e.cityCode,e.country," +
            "(select count(f.edu501Id) from Edu501 f where f.edu500Id = e.edu500Id),e.localName,e.localAddress,e.remarks) " +
            "from Edu500 e where e.edu500Id in ?1")
    List<Edu500> findAllByEdu500Ids(List<Long> edu500Ids);
}
