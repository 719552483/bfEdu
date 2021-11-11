package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu1071;
import com.beifen.edu.administration.domian.Edu204;
import com.beifen.edu.administration.domian.Edu206;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface Edu1071Dao extends JpaRepository<Edu1071, Long>, JpaSpecificationExecutor<Edu1071> {

    //根据任务书删除行政班关联信息
    @Transactional
    @Modifying
    @Query(value = "delete from Edu1071 where Edu107_ID =?1", nativeQuery = true)
    void removeByEdu107Id(String edu107_id);

    @Query(value = "select * from Edu1071 where edu107_id = ?1", nativeQuery = true)
    List<Edu1071> findByEdu107Id(String edu107Id);
}
