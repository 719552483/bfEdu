package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu502;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu502Dao extends JpaRepository<Edu502, Long>, JpaSpecificationExecutor<Edu502> {

    //根据教学点查询物资
    @Query(value = "select new com.beifen.edu.administration.domian.Edu502 (e.assetsType,e.assetsName,sum(e.assetsNum)) " +
            "from Edu502 e where e.edu500_ID = ?1 group by e.assetsType,e.assetsName")
    List<Edu502> findAllByEdu500Id(Long edu500Id);

    //根据教学任务点查询物资
    @Query(value = "select * from edu502 where edu501Id= ?1",nativeQuery = true)
    List<Edu502> findAllByEdu501Id(String edu501Id);


    //根据edu501Id删除物资信息
    @Modifying
    @Transactional
    @Query(value = "delete from Edu502 WHERE edu501Id in ?1")
    void deleteByEdu501Ids(List<Long> edu501Ids);
}
